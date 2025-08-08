import requests
import xml.etree.ElementTree as ET
from datetime import datetime
from typing import List

from app.schemas import NHKArticle


NHK_EASY_RSS = "https://www3.nhk.or.jp/news/easy/news-list.rss"


def fetch_nhk_easy_feed(limit: int = 20) -> List[NHKArticle]:
    resp = requests.get(NHK_EASY_RSS, timeout=15)
    resp.raise_for_status()
    root = ET.fromstring(resp.text)

    # Namespaces may vary; handle default 'channel/item'
    items = root.findall("./channel/item")
    results: List[NHKArticle] = []
    for item in items[:limit]:
        title = item.findtext("title") or ""
        link = item.findtext("link") or ""
        pub_date = item.findtext("pubDate") or ""
        description = item.findtext("description") or None
        article_id = link.rstrip("/").split("/")[-1]
        results.append(
            NHKArticle(
                id=article_id,
                title=title,
                link=link,
                published=pub_date,
                summary=description,
            )
        )
    return results


