import useSWR from "swr";

const projectId = "25028778";

export default function useSkydCommit(sha = "") {
  const cleanSha = sha.replace(/[^a-zA-Z0-9]*/g, "");
  const commitUrl = cleanSha ? `https://gitlab.com/api/v4/projects/${projectId}/repository/commits/${cleanSha}` : null;

  return useSWR(commitUrl);
}
