from abc import ABC, abstractmethod

class ScraperInterface(ABC):
    @abstractmethod
    def get_metadata(self):
        pass
    @abstractmethod
    def get_content(self):
        pass