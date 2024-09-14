#!/usr/bin/env vite-node --script

import { TreeViewServer } from "./treeViewServer";

async function run() {
    try {
        const treeViewClient = new TreeViewServer();
        treeViewClient.startServer();
    } catch (err) {
        console.error(err)
    }
}
run()