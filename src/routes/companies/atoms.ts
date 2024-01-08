import { apiSelector } from "components/providers/api/atoms";
import { selector } from "recoil";

interface NewCompany {
  name: string;
  domain: string;
  rate?: number;
  terms?: string;
}

export const companiesActions = selector({
  key: "companiesActions",
  get: ({ getCallback }) => {
    const create = getCallback(
      ({ snapshot }) =>
        async ({ domain, name, rate, terms }: NewCompany) => {
          const api = snapshot.getLoadable(apiSelector).getValue();
          await api.create("company", {
            domain,
            name,
            rate,
            terms,
          });
        }
    );

    const update = getCallback(
      ({ snapshot }) =>
        async ({
          id,
          domain,
          name,
          rate,
          terms,
        }: NewCompany & { id: number }) => {
          const api = snapshot.getLoadable(apiSelector).getValue();
          await api.update("company", {
            id,
            domain,
            name,
            rate,
            terms,
          });
        }
    );

    return {
      create,
      update,
    };
  },
});
