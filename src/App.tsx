import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import fs from 'fs';
import { remote, ipcRenderer } from 'electron';
import JSZip from 'jszip';
import { basename } from 'path';

const { app } = remote;

const Home = () => {
  const [filePaths, setFilePaths] = useState<string[]>([]);

  useEffect(() => {
    ipcRenderer.on('selected-directory', (_, files) => {
      setFilePaths(files);
    });
  }, []);

  useEffect(() => {
    if (filePaths) {
      const zip = new JSZip();
      filePaths.forEach((file) => {
        zip.file(`opa_guri/${basename(file)}`, fs.readFileSync(file));
      });

      const genZipAsync = async () => {
        const zipBuffer = await zip.generateAsync({
          type: 'nodebuffer',
          streamFiles: true,
        });

        fs.writeFileSync(`${app.getPath('home')}/test.zip`, zipBuffer);
      };

      genZipAsync();
    }
  }, [filePaths]);

  return (
    <div style={{ height: '100vh', background: '#FFFFFF' }}>
      <h1>Hello Inovação!</h1>
      <button
        type="button"
        onClick={() => ipcRenderer.send('open-file-dialog')}
      >
        Click me!
      </button>

      <div>
        <p>Uma lista irá aparecer aqui se você já clicou no botão: </p>
        {filePaths.map((path) => {
          return (
            <div key={path}>
              {path}
              <br />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Home} />
      </Switch>
    </Router>
  );
}
