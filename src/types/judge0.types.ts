export interface Judge0Submission {
  source_code: string;
  language_id: number;
  stdin: string;
  expected_output?: string;
}

export interface Judge0Response {
  token: string;
}

export interface Judge0Result {
  token: string;
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  status: {
    id: number;
    description: string;
  };
}
export interface Testcase {
  input: string;
  output: string;
}
