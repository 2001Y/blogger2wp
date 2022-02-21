// ▼ ▼ ▼ ▼ ▼ ▼ ▼  OPTION  ▼ ▼ ▼ ▼ ▼ ▼ ▼

const sampleXml = "blog-02-21-2022.xml";

const URL = "https://yoshikitam.wpx.jp/2001y/";
const WP_user = "2001Y"; //WPユーザー名
const WP_AppPass = "GgTg d2zR LQiu Vj2p xsGj hRkJ"; // Application Passwords

// ▲ ▲ ▲ ▲ ▲ ▲ ▲  OPTION  ▲ ▲ ▲ ▲ ▲ ▲ ▲

import fs from "fs";
import path from "path";
import url from "url";
import fetch from "node-fetch";
import xml2js from "xml2js";

const fetchHead = {
  "Content-Type": "application/json",
  Authorization:
    "Basic " + Buffer.from(WP_user + ":" + WP_AppPass).toString("base64"),
};

(async () => {
  const tagJSON = await fetch(
    path.join(URL, "/wp-json/wp/v2/tags?per_page=100")
  ).then((response) => response.json());

  const xmlData = fs.readFileSync(sampleXml, "utf-8");

  var parser = new xml2js.Parser();
  const raw = await parser
    .parseStringPromise(xmlData)
    .then((result) => result.feed.entry);

  const json = raw.filter(function (e) {
    if (e.id[0].match(/.post-/)) {
      return true;
    } else {
      return false;
    }
  });

  for (let e of json) {
    //記事毎の処理
    let postSlug = url.parse(e.link.pop()["$"].href).pathname;
    postSlug = postSlug.replace(path.extname(postSlug), "");

    let postDraft = "publish";
    if (e["app:control"]) {
      postDraft = "draft";
    }

    let postTag = [];
    let bloggerTags = e.category;
    if (bloggerTags) {
      let tagsList = [];
      for (let e of bloggerTags) {
        let tagName = e["$"].term;
        if (tagName != "http://schemas.google.com/blogger/2008/kind#post") {
          tagsList.push(e["$"].term);
        }
      }

      for (let tagName of tagsList) {
        // タグ毎の処理
        let tagId;
        let targetUser = tagJSON.find((v) => v.name === tagName);

        if (targetUser) {
          tagId = targetUser.id;
        } else {
          tagId = await fetch(path.join(URL, "/wp-json/wp/v2/tags"), {
            method: "POST",
            headers: fetchHead,
            body: JSON.stringify({
              name: tagName,
            }),
          })
            .then((response) => {
              if (response.ok) {
                console.log('タグ"' + tagName + '"追加');
              } else {
                console.error('error: タグ"' + tagName + '"追加');
              }
              return response.json();
            })
            .then((e) => e.id);
          tagJSON.push({
            id: tagId,
            name: tagName,
          });
        }
        postTag.push(tagId);
        // タグ毎の処理
      }
      // console.log(tagsList);
    }

    let postBody = {
      slug: postSlug,
      title: e.title[0]["_"],
      date: e.published[0],
      content: e.content[0]["_"],
      transition_source: [33],
      tags: postTag,
      status: postDraft,
    };

    await fetch(path.join(URL, "/wp-json/wp/v2/posts"), {
      method: "POST",
      headers: fetchHead,
      body: JSON.stringify(postBody),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Done: " + e.title[0]["_"]);
        } else {
          console.error("サーバーエラー");
        }
      })
      .catch((error) => {
        console.error("通信に失敗しました", error);
      });
    //記事毎の処理
  }
  console.log("移行DONE!!!");
})();
