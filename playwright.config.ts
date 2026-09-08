import {defineConfig,devices} from "@playwright/test";
const port=process.env.PLAYWRIGHT_PORT??"3107";
const baseURL=`http://localhost:${port}`;
export default defineConfig({testDir:"./e2e",use:{baseURL},webServer:{command:`npm run build && npm run start -- --port ${port}`,url:baseURL,reuseExistingServer:false,timeout:120_000,env:{...process.env,DEMO_SESSION_SECRET:"playwright-klyro-demo-session-secret"}},projects:[{name:"desktop",use:{...devices["Desktop Chrome"]}},{name:"tablet",use:{...devices["Desktop Chrome"],viewport:{width:1024,height:1366}}},{name:"mobile",use:{...devices["iPhone 13"]}}]});
