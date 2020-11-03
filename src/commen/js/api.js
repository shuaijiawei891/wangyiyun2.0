const baseUrl="/music"

var recommend = baseUrl+"/personalized?limit=6"

var recomleast = baseUrl+"/personalized/newsong"

var songlist = baseUrl+"/playlist/detail"

var listtime = baseUrl+"/toplist"

var searchResult=baseUrl+"/search"

var hots=baseUrl+"/search/hot"

var songdetail = baseUrl+"/song/detail"

var songurl =baseUrl+"/song/url"

var lyric =baseUrl+"/lyric"

export default {
    recommend,recomleast,songlist,listtime,searchResult,hots,songdetail,songurl,lyric
}