import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface SearchResult {
  groupName: string;
  groupType: 'group' | 'channel' | 'chat';
  lastSeen: string;
  messageCount: number;
  members: number;
}

interface SearchHistory {
  phone: string;
  timestamp: string;
  resultsCount: number;
}

const Index = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([
    { phone: '+7 (999) 123-45-67', timestamp: '2 часа назад', resultsCount: 5 },
    { phone: '+7 (912) 345-67-89', timestamp: 'Вчера', resultsCount: 3 },
    { phone: '+7 (905) 678-90-12', timestamp: '3 дня назад', resultsCount: 8 },
  ]);

  const mockResults: SearchResult[] = [
    { groupName: 'Разработчики Python', groupType: 'group', lastSeen: '2 часа назад', messageCount: 142, members: 2543 },
    { groupName: 'Telegram API Community', groupType: 'channel', lastSeen: '5 часов назад', messageCount: 89, members: 8921 },
    { groupName: 'Боты и автоматизация', groupType: 'group', lastSeen: 'Вчера', messageCount: 56, members: 1234 },
    { groupName: 'IT Вакансии Москва', groupType: 'channel', lastSeen: '2 дня назад', messageCount: 23, members: 15432 },
    { groupName: 'Личный чат с Иваном', groupType: 'chat', lastSeen: 'Неделю назад', messageCount: 12, members: 2 },
  ];

  const handleSearch = () => {
    if (!phoneNumber.trim()) return;
    
    setIsSearching(true);
    setTimeout(() => {
      setSearchResults(mockResults);
      setIsSearching(false);
      
      const newHistory: SearchHistory = {
        phone: phoneNumber,
        timestamp: 'Только что',
        resultsCount: mockResults.length,
      };
      setSearchHistory([newHistory, ...searchHistory.slice(0, 4)]);
    }, 1200);
  };

  const getTotalMentions = () => searchResults.reduce((sum, r) => sum + r.messageCount, 0);

  const getGroupTypeIcon = (type: string) => {
    switch (type) {
      case 'group':
        return 'Users';
      case 'channel':
        return 'Radio';
      case 'chat':
        return 'MessageCircle';
      default:
        return 'Users';
    }
  };

  const getGroupTypeLabel = (type: string) => {
    switch (type) {
      case 'group':
        return 'Группа';
      case 'channel':
        return 'Канал';
      case 'chat':
        return 'Чат';
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2 mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
              <Icon name="Search" className="text-primary-foreground" size={28} />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Telegram Search Bot</h1>
          </div>
          <p className="text-muted-foreground text-lg">Поиск упоминаний контакта в группах и чатах</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Поиск по номеру телефона</CardTitle>
            <CardDescription>Введите номер телефона для поиска во всех чатах и группах</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  type="tel"
                  placeholder="+7 (999) 123-45-67"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="text-lg h-12"
                />
              </div>
              <Button 
                onClick={handleSearch} 
                disabled={isSearching || !phoneNumber.trim()}
                className="h-12 px-8"
                size="lg"
              >
                {isSearching ? (
                  <>
                    <Icon name="Loader2" className="mr-2 h-5 w-5 animate-spin" />
                    Поиск...
                  </>
                ) : (
                  <>
                    <Icon name="Search" className="mr-2 h-5 w-5" />
                    Найти
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {searchResults.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="shadow-md">
                <CardHeader className="pb-3">
                  <CardDescription>Найдено групп</CardDescription>
                  <CardTitle className="text-4xl text-primary">{searchResults.length}</CardTitle>
                </CardHeader>
              </Card>
              
              <Card className="shadow-md">
                <CardHeader className="pb-3">
                  <CardDescription>Всего упоминаний</CardDescription>
                  <CardTitle className="text-4xl text-primary">{getTotalMentions()}</CardTitle>
                </CardHeader>
              </Card>
              
              <Card className="shadow-md">
                <CardHeader className="pb-3">
                  <CardDescription>Последняя активность</CardDescription>
                  <CardTitle className="text-2xl text-primary">{searchResults[0]?.lastSeen}</CardTitle>
                </CardHeader>
              </Card>
            </div>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Результаты поиска</CardTitle>
                <CardDescription>Группы и чаты, где был найден контакт</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {searchResults.map((result, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Icon name={getGroupTypeIcon(result.groupType)} className="text-primary" size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg truncate">{result.groupName}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {getGroupTypeLabel(result.groupType)}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Icon name="MessageSquare" size={16} />
                              <span>{result.messageCount} сообщений</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Icon name="Users" size={16} />
                              <span>{result.members.toLocaleString()} участников</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Icon name="Clock" size={16} />
                              <span>{result.lastSeen}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="flex-shrink-0">
                        <Icon name="ExternalLink" size={18} />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>История поисков</CardTitle>
            <CardDescription>Последние запросы поиска</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {searchHistory.map((history, index) => (
                <div key={index}>
                  <div 
                    className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer"
                    onClick={() => setPhoneNumber(history.phone)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon name="Phone" className="text-primary" size={20} />
                      </div>
                      <div>
                        <p className="font-medium">{history.phone}</p>
                        <p className="text-sm text-muted-foreground">{history.timestamp}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{history.resultsCount} результатов</Badge>
                      <Icon name="ChevronRight" className="text-muted-foreground" size={20} />
                    </div>
                  </div>
                  {index < searchHistory.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm pb-8">
          <Icon name="Shield" size={16} />
          <span>Все данные защищены и хранятся конфиденциально</span>
        </div>
      </div>
    </div>
  );
};

export default Index;
