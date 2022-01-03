import React from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import CreateCSR from './Components/CreateCSR';
import ImportCert from './Components/Importcert';


 function App() {
     return (
     <Tabs>
        <TabList>
          <Tab>Create CSR</Tab>
          <Tab>Import cert</Tab>
          <Tab>Download cert</Tab>
       </TabList>
       <TabPanel>
        <CreateCSR />
      </TabPanel>
      <TabPanel>
        <ImportCert />
      </TabPanel>
      <TabPanel>
        <CreateCSR />
      </TabPanel>
    </Tabs>
  );
}

export default App;
