import { config } from "dotenv";
import {join, dirname} from 'path'
import { fileURLToPath } from "url";
config({ path: join(dirname(fileURLToPath(import.meta.url)), '..', '.env')})