import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Answer {
    questionId: string;
    answerText: string;
}
export interface ApplicationRecord {
    id: bigint;
    status: string;
    applicantName: string;
    answers: Array<Answer>;
    timestamp: bigint;
    discordUsername: string;
}
export interface backendInterface {
    canisterVersion(): Promise<string>;
    getApplication(id: bigint): Promise<ApplicationRecord>;
    listApplications(): Promise<Array<ApplicationRecord>>;
    submitApplication(applicantName: string, discordUsername: string, rawAnswers: Array<[string, string]>): Promise<bigint>;
    updateStatus(id: bigint, status: string): Promise<void>;
}
