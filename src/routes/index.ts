import { Router } from "express";

import { sendSuccess } from "../common/response";
import { apiModules } from "../modules";

const router = Router();

router.get("/", (_request, response) => {
  sendSuccess(response, 200, "Backend v2 API is ready.", {
    modules: apiModules.map((moduleItem) => moduleItem.name),
  });
});

for (const moduleItem of apiModules) {
  router.use(moduleItem.route, moduleItem.router);
}

export default router;
