const core = require("@actions/core");
const github = require("@actions/github");
const axios = require("axios");

const waitForUrl = async (url, MAX_TIMEOUT, { headers }) => {
  const iterations = MAX_TIMEOUT / 2;
  for (let i = 0; i < iterations; i++) {
    try {
      await axios.get(url, { headers });
      return;
    } catch (e) {
      console.log("Url unavailable, retrying...");
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  core.setFailed(`Timeout reached: Unable to connect to ${url}`);
};

const run = async () => {
  try {
//    const BRANCH_NAME =  github.ref_name;
  const BRANCH_NAME =  core.getInput("branch_name");

    const MAX_TIMEOUT = Number(core.getInput("max_timeout")) || 500;

    const siteName = core.getInput("site_name");
    const basePath = core.getInput("base_path");
    

if (!siteName) {
      core.setFailed("Required field `site_name` was not provided");
    }
    const url = `https://${BRANCH_NAME}-${siteName}.pantheonsite.io${basePath}`;
core.setOutput("url", url);
    const extraHeaders = core.getInput("request_headers");
    const headers = !extraHeaders ? {} : JSON.parse(extraHeaders)
    console.log(`Waiting for a 200 from: ${url}`);
    await waitForUrl(url, MAX_TIMEOUT, {
      headers,
    });
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
