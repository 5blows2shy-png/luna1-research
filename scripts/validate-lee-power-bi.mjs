import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),Ajv=require('ajv');
const cache=new Map();
async function loadSchema(url){if(!url.startsWith('https://developer.microsoft.com/json-schemas/'))throw new Error('Unexpected schema host');if(!cache.has(url))cache.set(url,JSON.parse(execFileSync('curl',['-fsSL','--retry','2','--max-time','30',url],{encoding:'utf8'})));return cache.get(url);}
const ajv=new Ajv({allErrors:true,loadSchema,schemaId:'auto',unknownFormats:'ignore'});
function files(p){return fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(p,e.name)):[path.join(p,e.name)]);}
let count=0;
for(const file of files('reports/lee-data-center')){if(!/\.(json|pbip|pbir|pbism)$/.test(file))continue;const d=JSON.parse(fs.readFileSync(file,'utf8'));if(!d.$schema)continue;const validate=await ajv.compileAsync(await loadSchema(d.$schema));if(!validate(d)){console.error(file,validate.errors);process.exitCode=1;break;}count++;}
if(!process.exitCode)console.log(`Validated ${count} Power BI definitions against Microsoft schemas. Native Desktop verification remains required.`);
