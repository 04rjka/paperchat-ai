from langchain_community.embeddings import FastEmbedEmbeddings
from app.config import settings

class EmbeddingService:
    def __init__(self):
        self.model = FastEmbedEmbeddings(model_name=settings.embedding_model)
    
    def get(self):
        return self.model