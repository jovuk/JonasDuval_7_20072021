import http from "../http-common";

class CommentsDataServices {
    getAllComments(id, headers) {
        return http.get(`/articles/${id}/comments`, { headers });
    }
    createComment(id, data, headers) {
        return http.post(`/articles/${id}/comments`, data, { headers });
    }
    getOneComment(articleId, commentId, headers) {
        return http.get(`/articles/${articleId}/comments/${commentId}`,{ headers} )
    }
    update(articleId, commentId, data, headers) {
        return http.put(`/articles/${articleId}/comments/${commentId}`, data, { headers });
    }
    delete(articleId, commentId, headers) {
        return http.delete(`/articles/${articleId}/comments/${commentId}`, { headers });
    }
}

export default new CommentsDataServices();
