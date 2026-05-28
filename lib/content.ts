import {
  allProjects,
  allPosts,
  about,
  now,
} from 'contentlayer/generated';

export { allProjects, allPosts };

export const getAbout = () => about;
export const getNow = () => now;

export const sortedProjects = () =>
  allProjects.slice().sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

export const sortedPosts = () =>
  allPosts
    .filter((p) => !p.draft)
    .slice()
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
