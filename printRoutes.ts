// scripts/printRoutes.ts
import { appRouter } from 'c:/demo/chatroom/src/server/api/root'; // 根据你的实际路径调整

function printRoutes(router: any, prefix = '') {
    for (const [key, value] of Object.entries(router)) {
      const routeValue = value as { _def?: any }; // 类型断言
  
      if (routeValue._def) {
        console.log(`${prefix}${key}`);
        printRoutes(routeValue._def, `${prefix}${key}/`);
      }
    }
  }
  
  printRoutes(appRouter);