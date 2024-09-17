export interface ElectionResults {
  totalValidVotes: number;
  candidates: Candidate[];
  provinces: Province[];
}

export interface Province {
  name: string;
  totalValidVotes: number;
  candidates: Candidate[];
  districts: District[];
}

export interface District {
  name: string;
  totalValidVotes: number;
  candidates: Candidate[];
  divisions: Division[];
}

export interface Division {
  name: string;
  totalValidVotes: number;
  candidates: Candidate[];
}

export interface Candidate {
  name: string;
  data: CandidateVote;
}

export interface CandidateVote {
  value: number | null;
  percentage: number | null;
}

export interface VoteUpdatePayload {
  district: string;
  division: string;
  totalValidVotes: number;
  akdVotes: number;
  spVotes: number;
  rwVotes: number;
}

export const candidateEnum = new Map<string, string>([
  ["akd", "ANURA DISSANAYAKE"],
  ["sp", "SAJITH PREMADASA"],
  ["rw", "RANIL WICKRAMASINGHE"],
]);
