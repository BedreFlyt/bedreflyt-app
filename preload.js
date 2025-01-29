const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
    // Expose methods here
});