export default async function FetchService(
  url,
  token,
  requestMethod,
  requestBody
) {
  const fetchData = {
    headers: {
      "Content-Type": "application/json",
    },
    method: requestMethod,
  };

  if (token) {
    fetchData.headers.Authorization = `Bearer ${token}`;
  }

  if (requestBody) {
    fetchData.body = JSON.stringify(requestBody);
  }

  return await fetch(url, fetchData).then((response) => {
    // if (response.status === 200) return response.json();
    if (response.status === 200) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
      } else {
        return response.text();
      }
    }
  });
}
