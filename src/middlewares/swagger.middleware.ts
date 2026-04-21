import fs from "fs";
import path from "path";
import swaggerUi from "swagger-ui-express";
import YAML from "yaml";

const file = fs.readFileSync(path.resolve("./src/swagger.yaml"), "utf8");

const swaggerDocument = YAML.parse(file);

export { swaggerDocument, swaggerUi };
