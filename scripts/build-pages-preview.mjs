/** Build a static, noindex GitHub Pages preview without modifying the Next server app. */
import { cpSync, mkdtempSync, readFileSync, writeFileSync, symlinkSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { execFileSync } from 'node:child_process';
const root=process.cwd();
const basePath='/PMP-growth-agency';
const stage=mkdtempSync(join(tmpdir(),'pmp-pages-'));
for(const file of ['app','components','lib','content','tsconfig.json','package.json','package-lock.json','next-env.d.ts']) cpSync(join(root,file),join(stage,file),{recursive:true});
// Server endpoints and credentials never enter the static preview.
const {rmSync}=await import('node:fs');
rmSync(join(stage,'app/api'),{recursive:true,force:true});
symlinkSync(join(root,'node_modules'),join(stage,'node_modules'),'dir');
writeFileSync(join(stage,'next.config.ts'),`import type {NextConfig} from 'next';\nconst config:NextConfig={output:'export',basePath:'${basePath}',trailingSlash:true,images:{unoptimized:true},poweredByHeader:false};export default config;\n`);
const route=join(stage,'app/[locale]/[[...path]]/page.tsx');
writeFileSync(route,readFileSync(route,'utf8')+`\nexport function generateStaticParams(){return ['', 'work', 'services', 'about', 'contact', 'privacy', ...c.services.map(s=>'services/'+s.slug)].map(route=>({locale:'en',path:route?route.split('/'):[]}));}\n`);
for(const file of ['app/robots.ts','app/sitemap.ts'])writeFileSync(join(stage,file),`export const dynamic='force-static';\n`+readFileSync(join(stage,file),'utf8'));
const inquiry=join(stage,'lib/inquiries.ts');
writeFileSync(inquiry,readFileSync(inquiry,'utf8').replace(/export function inquiryReady\(\) \{[\s\S]*?\n\}/,'export function inquiryReady() {return false;}'));
execFileSync(process.execPath,[join(root,'node_modules/next/dist/bin/next'),'build','--webpack'],{cwd:stage,stdio:'inherit',env:{...process.env,NEXT_TELEMETRY_DISABLED:'1',SITE_PUBLIC:'false',SITE_URL:'',PRIVACY_NOTICE:'',PRIVACY_REVISION:'',INQUIRY_ENABLED:'false'}});
const destination=resolve(process.argv[2]||join(root,'.pages-preview'));
mkdirSync(destination,{recursive:true});
cpSync(join(stage,'out'),destination,{recursive:true});
writeFileSync(join(destination,'.nojekyll'),'');
const redirect=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><meta http-equiv="refresh" content="0;url=${basePath}/en/"><title>PMP Preview</title></head><body><a href="${basePath}/en/">Open the PMP website preview</a></body></html>`;
writeFileSync(join(destination,'index.html'),redirect);
mkdirSync(join(destination,'en/home'),{recursive:true});writeFileSync(join(destination,'en/home/index.html'),redirect);
console.log(`GitHub Pages preview written to ${destination}`);
