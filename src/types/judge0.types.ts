export interface Judge0Submission {
  source_code: string;
  language_id: number;
  stdin: string;
  expected_output?: string;
}

export interface Judge0Response {
  status: {
    id: number;
    description: string;
  };
  compile_output: string | null;
  stderr: string | null;
  memory: string | null;
  time: string | null;
  stdout: string | null;
  token: string;
  compileOutput?: string;
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
