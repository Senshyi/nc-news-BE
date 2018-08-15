exports.formatArticle = (articleData, userDocs, topicDocs) => {
  return articleData.map(articleDatum => {
      return {
        ...articleDatum,
        topic: topicDocs.find(topic => articleDatum.topic === topic.slug).slug,
        belongs_to: articleDatum.created_by,
        created_by: userDocs.find(user => user.nickname === articleDatum.belongs_to)._id
      };
  });
};

exports.formatComment = (commentData, articleDocs, userDocs) => {
   console.log(commentData[0])
  return commentData.map(commentDatum => {
    return {
      ...commentDatum,
      created_by: userDocs.find(user => user.username === commentDatum.created_by)._id,
      belongs_to: articleDocs.find(article => article.title === commentDatum.belongs_to)._id
    };
  });
};
