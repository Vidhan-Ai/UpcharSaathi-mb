import Parser from 'rss-parser';
import * as cheerio from 'cheerio';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || 'healthcare';
    const parser = new Parser();

    try {
        // Fetch Google News RSS Feed
        const feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`;
        const feed = await parser.parseURL(feedUrl);

        // Process and limit to top 6 articles
        const articles = await Promise.all(feed.items.slice(0, 6).map(async (item) => {
            // Basic metadata from RSS
            let article = {
                title: item.title,
                link: item.link,
                pubDate: item.pubDate,
                source: item.source || 'Google News',
                snippet: item.contentSnippet || item.content || ''
            };

            if (article.snippet) {
                const $ = cheerio.load(article.snippet);
                article.snippet = $.text();
            }

            return article;
        }));

        return Response.json({ articles });
    } catch (error) {
        console.error('Error fetching news:', error);
        return Response.json({ error: 'Failed to fetch news' }, { status: 500 });
    }
}
