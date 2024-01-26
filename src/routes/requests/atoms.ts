import { selector, selectorFamily } from "recoil";

export const requestsSelectorQuery = selector({
  key: "requestsSelectorQuery",
  get: async () => {
    // const { data } = await getRequests();
    return [
      {
        id: 1,
        name: "Juan Perez",
        employeeNumber: "123456",
        state: "NAY",
        createdAt: "2021-08-10T18:02:00.000Z",
      },
      {
        id: 2,
        name: "Jorge Lopez",
        employeeNumber: "93434",
        state: "NL",
        createdAt: "2024-01-10T18:02:00.000Z",
      },
      {
        id: 3,
        name: "Maria Hernandez",
        employeeNumber: "39433",
        state: "AGU",
        createdAt: "2024-01-16T18:02:00.000Z",
      },
    ].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  },
});

export const requestSelector = selectorFamily({
  key: "requestSelector",
  get: () => async () => {
    // const { data } = await getRequest(id);
    return {
      id: 1,
      firstName: "Juan",
      lastName: "Perez",
      employeeNumber: "123456",
      state: "NAY",
      city: "Tepic",
      country: "Mexico",
      createdAt: "2021-08-10T18:02:00.000Z",
      addressLineOne: "Calle 1",
      addressLineTwo: "Torre 4 1206",
      postalCode: "12345",
      bankAccountNumber: "123456789012345678",
    };
  },
});
