import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

function archivePersistencePlugin(): Plugin {
  return {
    name: 'archive-persistence-plugin',
    configureServer(server) {
      server.middlewares.use('/api/save-case-archive', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const { caseId, updatedNodes, updatedLinks } = data;
              if (!caseId) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Missing caseId' }));
                return;
              }

              const archiveFile = path.resolve(__dirname, `public/archives/${caseId}.json`);
              if (fs.existsSync(archiveFile)) {
                const archive = JSON.parse(fs.readFileSync(archiveFile, 'utf-8'));
                const existingTacticalNodeIds = new Set(archive.tactical.nodes.map((n: any) => n.id));
                const existingTacticalLinkIds = new Set(archive.tactical.links.map((l: any) => l.id));
                const existingFullNodeIds = new Set(archive.fullLedger.nodes.map((n: any) => n.id));
                const existingFullLinkIds = new Set(archive.fullLedger.links.map((l: any) => l.id));

                if (Array.isArray(updatedNodes)) {
                  updatedNodes.forEach((n: any) => {
                    if (!existingTacticalNodeIds.has(n.id)) {
                      archive.tactical.nodes.push(n);
                      existingTacticalNodeIds.add(n.id);
                    }
                    if (!existingFullNodeIds.has(n.id)) {
                      archive.fullLedger.nodes.push(n);
                      existingFullNodeIds.add(n.id);
                    }
                  });
                }

                if (Array.isArray(updatedLinks)) {
                  updatedLinks.forEach((l: any) => {
                    if (!existingTacticalLinkIds.has(l.id)) {
                      archive.tactical.links.push(l);
                      existingTacticalLinkIds.add(l.id);
                    }
                    if (!existingFullLinkIds.has(l.id)) {
                      archive.fullLedger.links.push(l);
                      existingFullLinkIds.add(l.id);
                    }
                  });
                }

                archive.stats = {
                  tacticalNodes: archive.tactical.nodes.length,
                  tacticalLinks: archive.tactical.links.length,
                  fullNodes: archive.fullLedger.nodes.length,
                  fullLinks: archive.fullLedger.links.length,
                };
                archive.generatedAt = new Date().toISOString();

                fs.writeFileSync(archiveFile, JSON.stringify(archive, null, 2), 'utf-8');
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 200;
                res.end(JSON.stringify({ success: true, stats: archive.stats }));
                return;
              }

              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'Archive not found' }));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          res.statusCode = 405;
          res.end('Method Not Allowed');
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), archivePersistencePlugin()],
});
