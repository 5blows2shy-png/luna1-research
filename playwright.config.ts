import {defineConfig,devices} from "@playwright/test";
export default defineConfig({testDir:"./e2e",use:{baseURL:"http://localhost:3107"},webServer:{command:"npm run dev -- --port 3107",url:"http://localhost:3107",reuseExistingServer:false},projects:[{name:"desktop",use:{...devices["Desktop Chrome"]}},{name:"mobile",use:{...devices["iPhone 13"]}}]});
