import useAxiosPrivate from "./useAxiosPrivate";

const API_KEY = import.meta.env.VITE_API_IDENTIFIER || 'multiservice_api_key_2024_secure';

const useFetch = () => {
  const axiosPrivate = useAxiosPrivate();

  const fetchData = async (url, token) => {
    const controller = new AbortController();

    let data;

    try {
      const response = await axiosPrivate.get(url, {
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${token}`,
          'x-api-key': API_KEY
        },
        withCredentials: true,
      });

      data = response.data;
      // console.log(data)
    } catch (error) {
      // console.log(error);

      return error;
      //navigate('/Login',{state:{from: location}, replace:true })
    }

    controller.abort();

    return { data };
  };

  return fetchData;
};

export default useFetch;
