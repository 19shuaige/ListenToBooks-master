import Service from '../../utils/request'
import {
  RecommendItemInterface,
  RecommendQueryInterface,
  SearchItemInterface,
  SearchPageResponseInterface,
  SearchParamsInterface
} from "./interfaces"


class CateGory extends Service {

  /**
   * @description 搜索功能
   * @param  {SearchParamsInterface} params 二级分类Id
   */
  // 搜索
  getSearchAlbumInfo(params: SearchParamsInterface) {
    return this.post<SearchPageResponseInterface<SearchItemInterface[]>>({
      url: '/api/search/albumInfo',
      data: params
    })
  }
  /**
   * @description: 获取搜索建议
   * @param {string} keyword 搜索关键字
   * @return {*}
   */
  getSearchSuggestions(keyword: string) {
    return this.get<string[]>({
      url: `/api/search/albumInfo/autoCompleteSuggest/${keyword}`,
      loading:false
    })
  }

  getRecommendAlbums(params: RecommendQueryInterface) {
    return this.post<SearchPageResponseInterface<RecommendItemInterface[]>>({
      url: '/api/search/albumInfo/recommend',
      data: params,
      silentError: true
    })
  }

  dislikeRecommendAlbum(albumId: number) {
    return this.get<boolean>({
      url: `/api/search/albumInfo/recommend/dislike/${albumId}`
    })
  }


}


export const search = new CateGory()
