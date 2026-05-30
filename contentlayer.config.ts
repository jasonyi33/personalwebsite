import { defineDocumentType, defineNestedType, makeSource } from 'contentlayer2/source-files';
import readingTime from 'reading-time';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';

const Link = defineNestedType(() => ({
  name: 'Link',
  fields: {
    label: { type: 'string', required: true },
    url: { type: 'string', required: true },
  },
}));

const BentoCard = defineNestedType(() => ({
  name: 'BentoCard',
  fields: {
    id: { type: 'string', required: true },
    title: { type: 'string', required: true },
    size: { type: 'string', default: 'sm' },
    body: { type: 'string' },
    items: { type: 'list', of: { type: 'string' }, default: [] },
    accent: { type: 'string' },
  },
}));

export const Project = defineDocumentType(() => ({
  name: 'Project',
  filePathPattern: 'projects/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    slug: { type: 'string', required: true },
    tagline: { type: 'string', required: true },
    status: {
      type: 'enum',
      options: ['live', 'wip', 'archived'],
      required: true,
    },
    statusLabel: { type: 'string' },
    year: { type: 'number', required: true },
    tags: { type: 'list', of: { type: 'string' }, default: [] },
    cover: { type: 'string' },
    live: { type: 'string' },
    repo: { type: 'string' },
    order: { type: 'number', default: 999 },
  },
  computedFields: {
    url: { type: 'string', resolve: (doc) => `/projects/${doc.slug}` },
    readingTime: { type: 'json', resolve: (doc) => readingTime(doc.body.raw) },
  },
}));

export const Experience = defineDocumentType(() => ({
  name: 'Experience',
  filePathPattern: 'experience/**/*.mdx',
  contentType: 'mdx',
  fields: {
    company: { type: 'string', required: true },
    slug: { type: 'string', required: true },
    role: { type: 'string', required: true },
    start: { type: 'string', required: true },
    end: { type: 'string' },
    location: { type: 'string' },
    summary: { type: 'string' },
    bullets: { type: 'list', of: { type: 'string' }, default: [] },
    tags: { type: 'list', of: { type: 'string' }, default: [] },
    order: { type: 'number', default: 999 },
  },
  computedFields: {
    url: { type: 'string', resolve: (doc) => `/experience/${doc.slug}` },
  },
}));

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: 'blog/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    slug: { type: 'string', required: true },
    date: { type: 'date', required: true },
    tags: { type: 'list', of: { type: 'string' }, default: [] },
    excerpt: { type: 'string', required: true },
    draft: { type: 'boolean', default: false },
  },
  computedFields: {
    url: { type: 'string', resolve: (doc) => `/feed#${doc.slug}` },
    readingTime: { type: 'json', resolve: (doc) => readingTime(doc.body.raw) },
    year: { type: 'number', resolve: (doc) => new Date(doc.date).getFullYear() },
  },
}));

export const About = defineDocumentType(() => ({
  name: 'About',
  filePathPattern: 'about.mdx',
  contentType: 'mdx',
  isSingleton: true,
  fields: {
    name: { type: 'string', required: true },
    handle: { type: 'string', required: true },
    role: { type: 'string', required: true },
    location: { type: 'string', required: true },
    email: { type: 'string' },
    links: { type: 'list', of: Link, default: [] },
  },
}));

export const Now = defineDocumentType(() => ({
  name: 'Now',
  filePathPattern: 'now.mdx',
  contentType: 'mdx',
  isSingleton: true,
  fields: {
    updated: { type: 'date', required: true },
    focus: { type: 'string' },
    location: { type: 'string' },
    reading: { type: 'string' },
    listening: { type: 'string' },
    learning: { type: 'string' },
    githubUser: { type: 'string' },
  },
}));

export const Interests = defineDocumentType(() => ({
  name: 'Interests',
  filePathPattern: 'interests.mdx',
  contentType: 'mdx',
  isSingleton: true,
  fields: {
    cards: { type: 'list', of: BentoCard, default: [] },
  },
}));

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Project, Experience, Post, About, Now, Interests],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          theme: 'github-dark',
          keepBackground: true,
        },
      ],
    ],
  },
});
