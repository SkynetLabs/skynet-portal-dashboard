import useSWR from "swr";
import prettyMilliseconds from "pretty-ms";
import prettyBytes from "pretty-bytes";
import { ReactComponent as Spinner } from "../svg/Spinner.svg";
import { ReactComponent as CheckCircle } from "../svg/CheckCircle.svg";
import { ReactComponent as Error } from "../svg/Error.svg";
import Link from "../components/Link";

const ServerRow = ({ server }) => {
  const { data, isValidating, error } = useSWR(`${server.address}/skynet/stats`);

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            {isValidating && <Spinner className="fill-current text-palette-300 animate-spin" />}
            {!isValidating && data && <CheckCircle className="fill-current text-primary" />}
            {!isValidating && error && <Error className="fill-current text-error" />}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              <Link href={server.address} className="hover:text-palette-400 transition-colors duration-200">
                {server.address}
              </Link>
            </div>
            <div className="text-sm text-gray-500">siad uptime {prettyMilliseconds(data?.uptime ?? 0 * 1000)}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">{data?.versioninfo?.version}</div>
        <div className="text-sm text-gray-500">{data?.versioninfo?.gitrevision}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {data && (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Online
          </span>
        )}
        {error && (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            {error.message}
          </span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">Files {data?.uploadstats?.numfiles ?? 0}</div>
        <div className="text-sm text-gray-500">Size {prettyBytes(data?.uploadstats?.totalsize ?? 0)}</div>
      </td>
    </tr>
  );
};

const ServerTable = ({ servers }) => {
  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Sia Daemon
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Upload stats
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {servers.map((server) => (
                  <ServerRow server={server} key={server.address} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function OverviewPage() {
  const { data } = useSWR("/servers.json");

  if (!data) return null;

  return (
    <div className="space-y-10">
      <ServerTable servers={data.production} />
      <ServerTable servers={data.development} />
    </div>
  );
}
