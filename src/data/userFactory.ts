import { faker } from '@faker-js/faker';

export const buildUserPayload = (
  overrides: Partial<{ name: string; job: string }> = {}
) => {
  return {
    // Ensuring we always provide a string, even if Faker has an edge case
    name: overrides.name ?? faker.person.firstName(), 
    job: overrides.job ?? faker.person.jobTitle()
  };
};