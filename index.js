import alfy from "alfy";
import { $ } from "execa";

const ACCOUNTS_LIST_CACHE_KEY = "accounts-list";

if (
  !alfy.cache.get(ACCOUNTS_LIST_CACHE_KEY) ||
  alfy.cache.isExpired(ACCOUNTS_LIST_CACHE_KEY)
)
  alfy.cache.set(
    ACCOUNTS_LIST_CACHE_KEY,
    (await $`ykman oath accounts list`).stdout,
    { maxAge: 5000 }
  );

/**
 * @type {string}
 */
const accounts = alfy.cache.get(ACCOUNTS_LIST_CACHE_KEY);

/**
 * @type {import("alfy").ScriptFilterItem[]}
 */
const items = alfy
  .inputMatches(accounts.trim().split("\n"))
  .map((id) => [id, ...id.split(":")])
  .map(([id, service, account]) => ({
    uid: id,
    title: service,
    subtitle: account,
    autocomplete: service,
    arg: id,
  }));

alfy.output(items);
