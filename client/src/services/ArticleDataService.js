import http from "../http-common";

class ArticleDataService {
    getAllArticles(headers) {
        return http.get("/articles", { headers });
    }

    getOneArticle(id, headers) {
        return http.get(`/articles/${id}`,{ headers });
    }
    createArticle(data, headers) {
        return http.post('/articles', data, { headers });
    }
    updateArticle(id, data, headers) {
        return http.put(`/articles/${id}`, data, { headers });
    }
    deleteArticle(id, headers) {
        return http.delete(`/articles/${id}`, { headers });
    }
    likeArticle(id, data, headers) {
        return http.post(`/articles/${id}/likes`, data, { headers });
    }
}

export default new ArticleDataService();
