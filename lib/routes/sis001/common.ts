import got from '@/utils/got';
import { load } from 'cheerio';
import { parseDate } from '@/utils/parse-date';
import timezone from '@/utils/timezone';

const baseUrl = 'https://www.sis001.com';

async function getThread(item) {
    const response = await got(item.link);
    const $ = load(response.data);

    item.category = $('.posttags a')
        .toArray()
        .map((a) => $(a).text());
    item.pubDate = timezone(
        parseDate(
            $('.postinfo')
                .eq(0)
                .text()
                .match(/发表于 (.*)\s*只看该作者/)[1],
            'YYYY-M-D HH:mm'
        ),
        8
    );
    $('div[id^=postmessage_] table, fieldset, .posttags, strong').remove();
    item.description = $('div[id^=postmessage_]').eq(0).remove('strong').html() + ($('.defaultpost .postattachlist').html() ?? '');
    return item;
}

export { baseUrl, getThread };