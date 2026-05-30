import {
  allProjects,
  allPosts,
  allExperiences,
  about,
  now,
  interest as interests,
} from 'contentlayer/generated';

export { allProjects, allPosts, allExperiences };

export const getAbout = () => about;
export const getNow = () => now;
export const getInterests = () => interests;

export const sortedProjects = () =>
  allProjects.slice().sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

export const sortedPosts = () =>
  allPosts
    .filter((p) => !p.draft)
    .slice()
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));

export const sortedExperiences = () =>
  allExperiences
    .slice()
    .sort((a, b) => {
      const o = (a.order ?? 999) - (b.order ?? 999);
      if (o !== 0) return o;
      return b.start.localeCompare(a.start);
    });
