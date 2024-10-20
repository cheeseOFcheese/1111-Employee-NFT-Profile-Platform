import React, { useState, useEffect } from 'react'
import { User, Award, FileText, Briefcase, Share2, Settings, Bell, BarChart2, Brain, Star, TrendingUp, Shield, Zap, ChevronDown, ChevronUp, X, Grid, List, Facebook, Linkedin, Twitter, Send, Book, MessageSquare, Clock, Gift, Coffee, Users, Filter, Upload, Bot, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"

// Types
type NFT = {
  id: string
  name: string
  type: 'Сертификат' | 'Награда' | 'Баф' | 'Диспел' | 'Дебаф' | 'Достижение'
  rarity: string
  image: string
  description: string
}

type Achievement = {
  id: string
  name: string
  type: string
  description: string
  nftId: string
}

type Buff = {
  id: string
  name: string
  description: string
  type: string
  duration: string
  icon: React.ReactNode
  progress: number
  nftId: string
  isActive: boolean
  activatedAt: number | null
}

type CareerStep = {
  id: string
  title: string
  description: string
  completed: boolean
  requiredAchievements: Achievement[]
}

// Updated mock data
const mockNFTs: NFT[] = [
  {
    id: '1',
    name: 'Покоритель знаний',
    type: 'Достижение',
    rarity: 'Обычный',
    image: '/placeholder.svg?height=100&width=100',
    description: 'Получите первое подтверждение своих навыков через Verifiable Credentials.',
  },
  {
    id: '2',
    name: 'Мастер времени',
    type: 'Достижение',
    rarity: 'Редкий',
    image: '/placeholder.svg?height=100&width=100',
    description: 'Завершите проект до установленного дедлайна и получите рекомендацию от коллег.',
  },
  {
    id: '3',
    name: 'Цифровой наставник',
    type: 'Достижение',
    rarity: 'Эпический',
    image: '/placeholder.svg?height=100&width=100',
    description: 'Преподайте мастер-класс или вебинар для своих коллег.',
  },
  {
    id: '4',
    name: 'Стейкер достижений',
    type: 'Достижение',
    rarity: 'Легендарный',
    image: '/placeholder.svg?height=100&width=100',
    description: 'Накопите 10 NFT-достижений за свою профессиональную карьеру.',
  },
  {
    id: '5',
    name: 'Светило компании',
    type: 'Достижение',
    rarity: 'Редкий',
    image: '/placeholder.svg?height=100&width=100',
    description: 'Поделитесь своим первым NFT-достижением в социальной сети.',
  },
]

const mockAchievements: Achievement[] = [
  {
    id: '1',
    name: 'Покоритель знаний',
    type: 'Навык',
    description: 'Получите первое подтверждение своих навыков через Verifiable Credentials.',
    nftId: '1',
  },
  {
    id: '2',
    name: 'Мастер времени',
    type: 'Soft Skill',
    description: 'Завершите проект до установленного дедлайна и получите рекомендацию от коллег.',
    nftId: '2',
  },
]

const initialBuffs: Buff[] = [
  {
    id: '1',
    name: 'Дополнительный выходной',
    description: 'Получите один дополнительный оплачиваемый выходной за достижение значимой карьерной цели или завершение важного проекта.',
    type: 'Отдых',
    duration: '1 день',
    icon: <Gift className="w-4 h-4" />,
    progress: 0,
    nftId: '1',
    isActive: false,
    activatedAt: null,
  },
  {
    id: '2',
    name: 'Ускоренное обучение',
    description: 'Получите доступ к эксклюзивным ускоренным программам обучения или мастер-классам для освоения нового навыка.',
    type: 'Обучение',
    duration: '7 дней',
    icon: <Brain className="w-4 h-4" />,
    progress: 0,
    nftId: '2',
    isActive: false,
    activatedAt: null,
  },
  {
    id: '3',
    name: 'Гибкий график',
    description: 'Получите возможность работать по гибкому графику на определённый срок.',
    type: 'Баланс',
    duration: '14 дней',
    icon: <Clock className="w-4 h-4" />,
    progress: 0,
    nftId: '3',
    isActive: false,
    activatedAt: null,
  },
]

const mockCareerSteps: CareerStep[] = [
  {
    id: '1',
    title: 'Младший разработчик',
    description: 'Освоить основы веб-разработки',
    completed: true,
    requiredAchievements: [],
  },
  {
    id: '2',
    title: 'Разработчик',
    description: 'Углубить знания в React и связанных технологиях',
    completed: false,
    requiredAchievements: [mockAchievements[0]],
  },
  {
    id: '3',
    title: 'Старший разработчик',
    description: 'Освоить архитектурные паттерны и руководство командой',
    completed: false,
    requiredAchievements: [mockAchievements[0], mockAchievements[1]],
  },
]

// Helper function to format time
const formatTime = (seconds: number) => {
  const days = Math.floor(seconds / (3600 * 24))
  const hours = Math.floor((seconds % (3600 * 24)) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  return `${days}д ${hours}ч ${minutes}м ${remainingSeconds}с`
}

const NFTIcon = ({ nft, onClick }: { nft: NFT, onClick: () => void }) => (
  <div
    className="inline-flex items-center cursor-pointer"
    onClick={onClick}
  >
    <img
      src={nft.image}
      alt={nft.name}
      className="w-6 h-6 rounded-full mr-2 object-cover"
    />
    <span>{nft.name}</span>
  </div>
)

// NFT Collection Component
const NFTCollection = ({ nfts, openPopup }: { nfts: NFT[], openPopup: (nftId: string) => void }) => {
  const [filter, setFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'rarity'>('name')
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')

  const filteredNFTs = nfts.filter(nft => filter === 'all' || nft.type === filter)
  const sortedNFTs = [...filteredNFTs].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    return b.rarity.localeCompare(a.rarity) // Assuming rarity is ordered from highest to lowest
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-900">NFT Коллекция</h2>
        <div className="flex space-x-2">
          <Select onValueChange={setFilter} defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Фильтр" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все</SelectItem>
              <SelectItem value="Сертификат">Сертификаты</SelectItem>
              <SelectItem value="Награда">Награды</SelectItem>
              <SelectItem value="Баф">Бафы</SelectItem>
              <SelectItem value="Диспел">Диспелы</SelectItem>
              <SelectItem value="Дебаф">Дебафы</SelectItem>
              <SelectItem value="Достижение">Достижения</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => setSortBy(value as 'name' | 'rarity')} defaultValue="name">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Сортировка" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">По имени</SelectItem>
              <SelectItem value="rarity">По редкости</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setLayout(layout === 'grid' ? 'list' : 'grid')}>
            {layout === 'grid' ? <Grid className="w-4 h-4" /> : <List className="w-4 h-4" />}
          </Button>
        </div>
      </div>
      <div className={layout === 'grid' ? "grid grid-cols-3 gap-4" : "space-y-4"}>
        {sortedNFTs.map((nft) => (
          <Card key={nft.id} className="cursor-pointer hover:shadow-lg transition-shadow duration-300 bg-opacity-65 backdrop-blur-md border border-white border-opacity-25" onClick={() => openPopup(nft.id)}>
            <CardContent className={`p-4 ${layout === 'list' ? "flex items-center space-x-4" : ""}`}>
              <NFTIcon nft={nft} onClick={() => openPopup(nft.id)} />
              <div>
                <p className="text-xs text-muted-foreground">{nft.type}</p>
                <p className="text-xs text-muted-foreground">{nft.rarity}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// NFT Popup Component
const NFTPopup = ({ nft, closePopup }: { nft: NFT, closePopup: () => void }) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('.nft-popup-content')) {
        closePopup()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [closePopup])

  const shareOnSocialMedia = (platform: string) => {
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(`Check out my ${nft.name} NFT!`)
    let shareUrl = ''

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
        break
      case 'linkedin':
        shareUrl =   `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}`
        break
    }

    window.open(shareUrl, '_blank')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-96 nft-popup-content relative bg-opacity-85 backdrop-blur-md border border-white border-opacity-25">
        <CardHeader>
          <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-900">{nft.name}</CardTitle>
          <Button className="absolute top-2 right-2 rounded-full w-8 h-8 p-0" variant="ghost" onClick={closePopup}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <img src={nft.image} alt={nft.name} className="w-full h-48 object-cover mb-4 rounded shadow-lg" />
          <p className="text-sm mb-2"><strong>Тип:</strong> {nft.type}</p>
          <p className="text-sm mb-2"><strong>Редкость:</strong> {nft.rarity}</p>
          <p className="text-sm">{nft.description}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex  space-x-2">
            <Button variant="outline" size="icon" onClick={() => shareOnSocialMedia('twitter')}>
              <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => shareOnSocialMedia('facebook')}>
              <Facebook className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => shareOnSocialMedia('linkedin')}>
              <Linkedin className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="secondary" onClick={closePopup}>Закрыть</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

// Buff Component
const BuffComponent = ({ buff, activateBuff, openPopup }: { buff: Buff, activateBuff: (buffId: string) => void, openPopup: (nftId: string) => void }) => {
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (buff.isActive && buff.activatedAt) {
      const updateTimer = () => {
        const now = Date.now()
        const elapsed = Math.floor((now - buff.activatedAt!) / 1000)
        const duration = parseInt(buff.duration) * 24 * 60 * 60 // Convert days to seconds
        const remaining = Math.max(duration - elapsed, 0)
        setTimeLeft(remaining)

        if (remaining === 0) {
          clearInterval(timer)
        }
      }

      updateTimer()
      timer = setInterval(updateTimer, 1000)
    }

    return () => clearInterval(timer)
  }, [buff.isActive, buff.activatedAt, buff.duration])

  return (
    <li className="flex items-center justify-between p-2 rounded-md transition-colors duration-200 bg-opacity-65 backdrop-blur-md border border-white border-opacity-25">
      <div className="flex items-center space-x-2">
        {buff.icon}
        <NFTIcon
          nft={mockNFTs.find(nft => nft.id === buff.nftId)!}
          onClick={() => openPopup(buff.nftId)}
        />
      </div>
      {buff.isActive ? (
        <div className="text-sm">
          Осталось: {formatTime(timeLeft)}
        </div>
      ) : (
        <Button 
          className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white"
          onClick={() => activateBuff(buff.id)}
        >
          Активировать
        </Button>
      )}
    </li>
  )
}

// ExpandedProfileBlock component
const ExpandedProfileBlock = ({
  achievements,
  buffs,
  careerLevel,
  experience,
  superLikes,
  completedProjects,
  completedCourses,
  openPopup
}: {
  achievements: Achievement[]
  buffs: Buff[]
  careerLevel: number
  experience: number
  superLikes: number
  completedProjects: number
  completedCourses: number
  openPopup: (nftId: string) => void
}) => {
  return (
    <div className="space-y-6">
      <Card className="bg-opacity-65 backdrop-blur-md border border-white border-opacity-25">
        <CardHeader>
          <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">Профиль сотрудника</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20 ring-2 ring-purple-500 ring-offset-2 ring-offset-background">
              <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Employee avatar" />
              <AvatarFallback>ИС</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-900">Иван Сидоров</h2>
              <p className="text-muted-foreground">Full Stack Developer</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Карьерный уровень</p>
              <p className="text-lg font-semibold">{careerLevel}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Опыт</p>
              <p className="text-lg font-semibold">{experience} XP</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Супер-лайки</p>
              <p className="text-lg font-semibold">{superLikes}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Завершенные проекты</p>
              <p className="text-lg font-semibold">{completedProjects}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-opacity-65 backdrop-blur-md border border-white border-opacity-25">
        <CardHeader>
          <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">Достижения</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {achievements.map((achievement) => (
              <li key={achievement.id} className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <NFTIcon
                  nft={mockNFTs.find(nft => nft.id === achievement.nftId)!}
                  onClick={() => openPopup(achievement.nftId)}
                />
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-opacity-65 backdrop-blur-md border border-white border-opacity-25">
        <CardHeader>
          <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">Активные бафы</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {buffs.filter(buff => buff.isActive).map((buff) => (
              <BuffComponent key={buff.id} buff={buff} activateBuff={() => {}} openPopup={openPopup} />
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

// CareerCenter component
const CareerCenter = ({ careerSteps, openPopup }: { careerSteps: CareerStep[], openPopup: (nftId: string) => void }) => {
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([])
  const [userInput, setUserInput] = useState('')

  const handleSendMessage = () => {
    if (userInput.trim() === '') return

    setChatMessages([...chatMessages, { role: 'user', content: userInput }])
    setUserInput('')

    // Simulate AI response (replace with actual AI integration)
    setTimeout(() => {
      setChatMessages(prev => [...prev, { role: 'ai', content: 'Это отличный вопрос! Давайте обсудим ваши карьерные цели и составим план развития.' }])
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <Card className="bg-opacity-50 backdrop-blur-md border border-white border-opacity-20">
        <CardHeader>
          <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">Карьерный роад-мап</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {careerSteps.map((step, index) => (
              <div key={step.id} className="flex items-start space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${step.completed ? 'bg-green-500' : 'bg-blue-500'}`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                  {step.requiredAchievements.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-semibold">Необходимые достижения:</p>
                      <ul className="list-disc list-inside text-sm">
                        {step.requiredAchievements.map((achievement) => (
                          <li key={achievement.id} className="cursor-pointer text-blue-400 hover:underline" onClick={() => openPopup(achievement.nftId)}>
                            <NFTIcon
                              nft={mockNFTs.find(nft => nft.id === achievement.nftId)!}
                              onClick={() => openPopup(achievement.nftId)}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-opacity-50 backdrop-blur-md border border-white border-opacity-20">
        <CardHeader>
          <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">Карьерный эксперт AI</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 overflow-y-auto mb-4 p-4 bg-black bg-opacity-20 rounded-md">
            {chatMessages.map((message, index) => (
              <div key={index} className={`mb-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                  {message.content}
                </span>
              </div>
            ))}
          </div>
          <div className="flex space-x-2">
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Задайте вопрос о вашей карьере..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="bg-black bg-opacity-20 border-white border-opacity-20"
            />
            <Button onClick={handleSendMessage} className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// SettingsSection component
const SettingsSection = () => {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [avatar, setAvatar] = useState('/placeholder.svg?height=80&width=80')

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement password change logic here
    console.log('Password change requested')
    toast({
      title: "Пароль изменен",
      description: "Ваш пароль был успешно обновлен",
    })
  }

  const handleDeleteNFT = (nftId: string) => {
    // Implement NFT deletion logic here
    console.log(`Delete NFT requested for ID: ${nftId}`)
    toast({
      title: "NFT удален",
      description: "Выбранный NFT был успешно удален из вашей коллекции",
    })
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-opacity-50 backdrop-blur-md border border-white border-opacity-20">
        <CardHeader>
          <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">Изменить аватар</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={avatar} alt="User avatar" />
              <AvatarFallback>ИС</AvatarFallback>
            </Avatar>
            <Label htmlFor="avatar-upload" className="cursor-pointer">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-3 py-2 rounded-md hover:from-blue-700 hover:to-blue-900 transition-colors duration-200">
                <Upload className="w-4 h-4" />
                <span>Загрузить новый аватар</span>
              </div>
              <Input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-opacity-50 backdrop-blur-md border border-white border-opacity-20">
        <CardHeader>
          <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">Изменить пароль</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="old-password">Текущий пароль</Label>
              <Input
                id="old-password"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                className="bg-black bg-opacity-20 border-white border-opacity-20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Новый пароль</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="bg-black bg-opacity-20 border-white border-opacity-20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Подтвердите новый пароль</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-black bg-opacity-20 border-white border-opacity-20"
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white">Изменить пароль</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-opacity-50 backdrop-blur-md border border-white border-opacity-20">
        <CardHeader>
          <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">Управление NFT</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockNFTs.map((nft) => (
              <div key={nft.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <NFTIcon nft={nft} onClick={() => {}} />
                </div>
                <Button variant="destructive" onClick={() => handleDeleteNFT(nft.id)}>Удалить</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Main component
export default function DigitalEmployeeProfile() {
  const [isRegistered, setIsRegistered] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null)
  const [selectedBuff, setSelectedBuff] = useState<Buff | null>(null)
  const [buffs, setBuffs] = useState<Buff[]>(initialBuffs)

  const openPopup = (nftId: string) => {
    const nft = mockNFTs.find(n => n.id === nftId)
    if (nft) {
      setSelectedNFT(nft)
    }
  }

  const closePopup = () => {
    setSelectedNFT(null)
    setSelectedBuff(null)
  }

  const activateBuff = (buffId: string) => {
    setBuffs(prevBuffs => prevBuffs.map(buff => 
      buff.id === buffId ? { ...buff, isActive: true, activatedAt: Date.now() } : buff
    ))

    // Simulate server communication -  No changes needed here as it's a console log, not a network call.
    console.log(`Activating buff ${buffId} on the server`)
    toast({
      title: "Баф активирован",
      description: "Информация отправлена на сервер",
    })
  }

  if (!isRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center p-4">
        <RegistrationForm onRegister={() => setIsRegistered(true)} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex flex-col">
      <header className="bg-gray-800 bg-opacity-45 backdrop-blur-md py-4 px-6 sticky top-0 z-10">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-900">Цифровой Профиль Сотрудника</h1>
          <User className="text-blue-400 w-8 h-8" />
        </div>
      </header>
      
      <main className="flex-grow p-6">
        <div className="max-w-4xl mx-auto bg-gray-800 bg-opacity-45 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-gray-700">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="profile">Профиль</TabsTrigger>
              <TabsTrigger value="nft">NFT Коллекция</TabsTrigger>
              <TabsTrigger value="buffs">Бафы</TabsTrigger>
              <TabsTrigger value="career-center">Карьерный центр</TabsTrigger>
              <TabsTrigger value="settings">Настройки</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <ExpandedProfileBlock
                achievements={mockAchievements}
                buffs={buffs}
                careerLevel={3}
                experience={5000}
                superLikes={20}
                completedProjects={15}
                completedCourses={5}
                openPopup={openPopup}
              />
            </TabsContent>

            <TabsContent value="nft">
              <NFTCollection nfts={mockNFTs} openPopup={openPopup} />
            </TabsContent>

            <TabsContent value="buffs">
              <Card className="bg-opacity-65 backdrop-blur-md border border-white border-opacity-25">
                <CardHeader>
                  <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">Доступные бафы</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {buffs.map((buff) => (
                      <BuffComponent key={buff.id} buff={buff} activateBuff={activateBuff} openPopup={openPopup} />
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="career-center">
              <CareerCenter careerSteps={mockCareerSteps} openPopup={openPopup} />
            </TabsContent>

            <TabsContent value="settings">
              <SettingsSection />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {selectedNFT && <NFTPopup nft={selectedNFT} closePopup={closePopup} />}
    </div>
  )
}

// RegistrationForm component
const RegistrationForm = ({ onRegister }: { onRegister: () => void }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the registration data to your backend - No changes needed here as it's a console log, not a network call.
    console.log('Registration submitted:', { name, email, password })
    onRegister()
  }

  return (
    <Card className="w-full max-w-md bg-opacity-65 backdrop-blur-md border border-white border-opacity-25">
      <CardHeader>
        <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-900">Регистрация</CardTitle>
        <CardDescription>Создайте свой цифровой профиль сотрудника</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Имя</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="bg-black bg-opacity-20 border-white border-opacity-25" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-black bg-opacity-20 border-white border-opacity-25" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-black bg-opacity-20 border-white border-opacity-25" />
          </div>
          <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white">Зарегистрироваться</Button>
        </form>
      </CardContent>
    </Card>
  )
}
