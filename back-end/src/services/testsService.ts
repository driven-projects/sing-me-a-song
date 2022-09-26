import * as testsRepository from '../repositories/testsRepository';

export async function truncate() {
  await testsRepository.truncate();
}

export async function populateDatabase(){
  await testsRepository.populateDatabase()
}