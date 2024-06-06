import { Express } from "express";
import axios from "axios";

export default function (app: Express) {
  let defaultConfig = {
    method: "get",
    maxBodyLength: Infinity,
    headers: {},
  };
  app.post(`/history`, async (req, res) => {
    const modifyConfigURL = (param: string) => {
      return `https://www.ipqualityscore.com/api/json/requests/XWLVJZNqiRWZsHAmnq1GLOQl8DayorxU/list?type=${param}&start_date=2024-01-01&stop_date=2024-09-09`;
    };
    let config = {
      ...defaultConfig,
    };
    let results = [];
    const rUrl = await axios({
      ...config,

      url: modifyConfigURL("url"),
    });
    const rEmail = await axios({ ...config, url: modifyConfigURL("email") });
    if (rUrl && rUrl.data && rUrl.data.success) {
      results = [...results, ...rUrl.data.requests];
    }
    if (rEmail && rEmail.data && rEmail.data.success) {
      results = [...results, ...rEmail.data.requests];
    }
    res.json({
      status: rUrl && rEmail && rUrl.data && rEmail.data ? true : false,
      data: results,
      length: results.length,
    });
  });

  app.post(`/email-scan`, async (req, res) => {
    const { email } = req.body;
    let config = {
      ...defaultConfig,
      url: `https://www.ipqualityscore.com/api/json/email/XWLVJZNqiRWZsHAmnq1GLOQl8DayorxU/${email}`,
    };
    const r = await axios(config);
    res.json({
      status: r && r.data ? true : false,
      data: r.data,
    });
  });

  app.post(`/database-scan`, async (req, res) => {
    const { email } = req.body;

    let config = {
      ...defaultConfig,
      url: `https://www.ipqualityscore.com/api/json/leaked/email/XWLVJZNqiRWZsHAmnq1GLOQl8DayorxU/${email}`,
    };
    const r = await axios(config);
    res.json({
      status: r && r.data ? true : false,
      data: r.data,
    });
  });

  app.post(`/scan-url`, async (req, res) => {
    const { url } = req.body;
    let config = {
      ...defaultConfig,
      url: `https://www.ipqualityscore.com/api/json/url/XWLVJZNqiRWZsHAmnq1GLOQl8DayorxU/${url}`,
    };
    const r = await axios(config);
    res.json({
      status: r && r.data ? true : false,
      data: r.data,
    });
  });
}
