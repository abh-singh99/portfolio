import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { appProjects, getProject } from '@/content/projects';
import { StoreRedirect } from './StoreRedirect';

type Params = { slug: string };

export function generateStaticParams() {
  return appProjects().map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return { title: `Get ${project.name}`, robots: { index: false, follow: false } };
}

export default async function GetApp({ params }: { params: Promise<Params> }) {
  const project = getProject((await params).slug);
  if (!project || project.link?.kind !== 'app') notFound();
  return <StoreRedirect name={project.name} android={project.link.android} ios={project.link.ios} />;
}
