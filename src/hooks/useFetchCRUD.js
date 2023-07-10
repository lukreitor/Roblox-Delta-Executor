import { useEffect, useState } from "react";

export const useFetchCRUD = (url, bearerToken) => {
  const [data, setData] = useState([]);

  const [newData, setNewData] = useState();

  const [config, setConfig] = useState(null);
  const [method, setMethod] = useState(null);
  const [callFetch, setCallFetch] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(false);

  const [itemId, setItemId] = useState(null);

  const httpConfig = (data, method, bearerToken) => {
    if (method === "POST" || method === "CREATE") {

      if(bearerToken){
        setConfig({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization':`Bearer ${bearerToken}`,
          },
          body: JSON.stringify(data),
        });
      }

      if(!bearerToken){
        setConfig({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      }

      if(method === "POST"){
        setMethod("POST");
      } else {
        setMethod("CREATE");
        setNewData(data);
      }

    } else if (method === "DELETE"){
      if(bearerToken){
        setConfig({
          method: "DELETE",
          headers: {
            'Authorization':`Bearer ${bearerToken}`,
          }
        });
        setMethod("DELETE");
        setItemId(data.id);
        setNewData(data);
      }

    } else if(method === "PUT"){
      if(bearerToken){
        setConfig({
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            'Authorization':`Bearer ${bearerToken}`,
          },
          body: JSON.stringify(data),
        });
        setMethod("PUT");
      }
  }};

  useEffect(() => {
    const fetchDatas = async () => {
      // 6 - estado de loading
      // mudar throttling no network p 3g
      setLoading(true);

      // 8 - tratando erros
      try {
        let configGet;
        let res;

        if(bearerToken){
          configGet = {headers: {'Authorization':`Bearer ${bearerToken}`,}};
          res = await fetch(`${url}find-all`, configGet);
        } 
        
        if(!bearerToken){
          res = await fetch(`${url}find-all`); 
        }

        const json = await res.json();

        setData(json);
        setMethod(null);

        // 8 - tratando erros
        setError(null);
      } catch (error) {
        console.log(error.message);

        setError("Houve um erro ao carregar os dados!");
      }

      setLoading(false);
    };

    fetchDatas();
  }, [url, callFetch, bearerToken]);

  // 5 - refatorando post
  useEffect(() => {
    const httpRequest = async () => {
      setLoading(true);
      if (method === "POST") {
        // 7 - loading no post
        // mudar throttling no network p 3g
        // 5 - refatorando post
        let fetchOptions = [url, config];

        const res = await fetch(...fetchOptions);

        const json = await res.json();
        
        setCallFetch(json);
        
      } else if (method === "DELETE") {
        const deleteUrl = `${url}delete/${itemId}`;

        const res = await fetch(deleteUrl, config);

        const json = await res.json();

        setCallFetch(json);
      } else if(method === "PUT"){
        const putUrl = `${url}update/`;

        const res = await fetch(putUrl, config);

        const json = await res.json();

        setCallFetch(json);
      } else if(method === "CREATE"){
        const createUrl = `${url}create/`

        const res = await fetch(createUrl, config);

        const json = await res.json();

        setCallFetch(json);
      } else if(method === "FIND-BY-ID"){
        const findByIdUrl = `${url}find-by-id/${data.id}`;

        const res = await fetch(findByIdUrl);

        const json = await res.json();

        setData(json);
      }
      setLoading(false);
    };

    httpRequest();
  }, [config, itemId, method, url, data.id, newData]);

  return { data, httpConfig, loading, error, setCallFetch };
};