import Parser from 'rss-parser';
import * as cheerio from 'cheerio';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || 'healthcare';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 6;

    const parser = new Parser();

    try {
        // Fetch Google News RSS Feed
        const feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`;
        const feed = await parser.parseURL(feedUrl);

        // Calculate pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const totalItems = feed.items.length;
        const totalPages = Math.ceil(totalItems / limit);

        // Process and limit to requested page
        const articles = await Promise.all(feed.items.slice(startIndex, endIndex).map(async (item) => {
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

        return Response.json({
            articles,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
                hasNextPage: endIndex < totalItems,
                hasPrevPage: startIndex > 0
            }
        });
    } catch (error) {
        console.error('Error fetching news:', error);
        return Response.json({ error: 'Failed to fetch news' }, { status: 500 });
    }
}
