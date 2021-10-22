import { createClient } from "graphql-ws";
import ws from "ws";

// const API_URL = "ws://studio.laceti.com.br:4000/graphql";
const API_URL = "ws://localhost:4000/graphql";

const client = createClient({
  url: API_URL,
  webSocketImpl: ws,
  connectionParams: {
    authorization: null,
  },
});

const query_consult: string =
  "{  users {    value {      id      firstName      lastName    } } }";
// const query_consult: string = "{  me  { id      firstName      lastName    } }";

async function getToken(email: string, password: string) {
  let resp = await new Promise((resolve) => {
    let result: unknown;
    client.subscribe(
      {
        query: `{ login (email: \"${email}\", password: \"${password}\") { token } }`,
      },
      {
        next: (data) => (result = data),
        error: (error) => console.log(error),
        complete: () => resolve(result),
      }
    );
  });
  // console.log("test " + JSON.parse(JSON.stringify(resp)).data.login);
  return resp;
}

getToken("admin@teste.com", "123")
  // getToken("lhcs@cin.com", "1234")
  .then((res) => {
    let res_json = JSON.parse(JSON.stringify(res));
    let token = res_json.data.login.token;
    // console.log(token);
    const client2 = createClient({
      url: API_URL,
      webSocketImpl: ws,
      connectionParams: {
        authorization: `Bearer ${token}`,
      },
    });
    (async () => {
      const result = await new Promise((resolve) => {
        let result: unknown;
        client2.subscribe(
          {
            query: query_consult,
          },
          {
            next: (data) => (result = data),
            error: (error) => console.log(error), //reject,
            complete: () => resolve(result),
          }
        );
      });
      console.log(JSON.stringify(result));
      return result;
    })();
  })
  .catch((err) => console.log(err));
