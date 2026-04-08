/*
 * ORIZON — Gestão Viva
 * Módulo: Feed Corporativo
 * Comunicados, reconhecimentos, aniversários, conquistas
 */

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Heart, MessageCircle, Share2, Plus, Bell, Star, Trophy,
  Cake, Megaphone, Image, Smile, Send, Bookmark
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const posts = [
  {
    id: 1, tipo: "conquista", autor: "Fernanda Lima", cargo: "Diretora de Pessoas",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=40&h=40&fit=crop&crop=face",
    tempo: "há 2 horas",
    conteudo: "🏆 Parabéns ao time de Vendas por bater a meta de Q1 com 112% de atingimento! Resultado incrível de toda a equipe. Vocês são demais! #VendaViva #ORIZON",
    curtidas: 48, comentarios: 12, destaque: true
  },
  {
    id: 2, tipo: "aniversario", autor: "ORIZON", cargo: "Sistema",
    avatar: null,
    tempo: "há 3 horas",
    conteudo: "🎂 Hoje é aniversário de Lucas Ferreira! Deseje feliz aniversário para ele. 🎉",
    curtidas: 32, comentarios: 18, destaque: false
  },
  {
    id: 3, tipo: "comunicado", autor: "Carlos Mendes", cargo: "Gerente de RH",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    tempo: "há 5 horas",
    conteudo: "📢 Comunicado Importante: O processo de Avaliação de Desempenho Q1 2025 está aberto. Todos os colaboradores devem completar a autoavaliação até 15/04. Acesse o módulo de Avaliação para começar.",
    curtidas: 15, comentarios: 4, destaque: false
  },
  {
    id: 4, tipo: "reconhecimento", autor: "Ana Souza", cargo: "Consultora de Vendas",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face",
    tempo: "há 1 dia",
    conteudo: "Quero reconhecer publicamente o Lucas Ferreira pela ajuda incrível na preparação da proposta para o cliente XYZ. Sem ele, não tínhamos fechado! 🙌 #Reconhecimento #Gratidão",
    curtidas: 27, comentarios: 8, destaque: false
  },
  {
    id: 5, tipo: "conquista", autor: "ORIZON", cargo: "Sistema",
    avatar: null,
    tempo: "há 2 dias",
    conteudo: "🎯 Beatriz Santos completou a trilha 'Excel e Power BI para RH' com nota 98/100! Parabéns pela dedicação! 🎓",
    curtidas: 21, comentarios: 6, destaque: false
  },
];

const tipoColors: Record<string, string> = {
  conquista: "bg-amber-100 text-amber-700",
  aniversario: "bg-pink-100 text-pink-700",
  comunicado: "bg-indigo-100 text-indigo-700",
  reconhecimento: "bg-emerald-100 text-emerald-700",
};

const tipoIcons: Record<string, React.ElementType> = {
  conquista: Trophy,
  aniversario: Cake,
  comunicado: Megaphone,
  reconhecimento: Star,
};

export default function Feed() {
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [novoPost, setNovoPost] = useState("");
  const [showCompose, setShowCompose] = useState(false);

  const toggleLike = (id: number) => {
    setLiked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handlePost = () => {
    if (!novoPost.trim()) return;
    toast.success("Publicação enviada!");
    setNovoPost("");
    setShowCompose(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Feed Corporativo</h1>
          <p className="text-muted-foreground text-sm mt-1">Comunicados, conquistas e reconhecimentos</p>
        </div>
        <Button size="sm" className="orizon-gradient text-white" onClick={() => setShowCompose(!showCompose)}>
          <Plus className="w-4 h-4 mr-2" />Publicar
        </Button>
      </div>

      {/* Compose */}
      {showCompose && (
        <Card className="orizon-card border-indigo-200">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-start gap-3">
              <Avatar className="w-9 h-9 shrink-0">
                <AvatarImage src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=40&h=40&fit=crop&crop=face" />
                <AvatarFallback>F</AvatarFallback>
              </Avatar>
              <Textarea
                placeholder="Compartilhe um comunicado, reconhecimento ou conquista..."
                value={novoPost}
                onChange={(e) => setNovoPost(e.target.value)}
                className="resize-none min-h-[80px]"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => toast.info("Adicionar imagem")}>
                  <Image className="w-4 h-4 mr-1" />Imagem
                </Button>
                <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => toast.info("Reconhecer colega")}>
                  <Star className="w-4 h-4 mr-1" />Reconhecer
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowCompose(false)}>Cancelar</Button>
                <Button size="sm" className="orizon-gradient text-white" onClick={handlePost}>
                  <Send className="w-3.5 h-3.5 mr-1.5" />Publicar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts */}
      {posts.map((post) => {
        const TipoIcon = tipoIcons[post.tipo];
        const isLiked = liked.has(post.id);
        return (
          <Card key={post.id} className={cn("orizon-card", post.destaque && "border-amber-300 ring-1 ring-amber-200")}>
            <CardContent className="p-5">
              {/* Header */}
              <div className="flex items-start gap-3 mb-3">
                {post.avatar ? (
                  <Avatar className="w-10 h-10 shrink-0">
                    <AvatarImage src={post.avatar} />
                    <AvatarFallback>{post.autor[0]}</AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="w-10 h-10 rounded-full orizon-gradient flex items-center justify-center shrink-0">
                    <TipoIcon className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm">{post.autor}</span>
                    <span className="text-xs text-muted-foreground">{post.cargo}</span>
                    <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full", tipoColors[post.tipo])}>
                      {post.tipo}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">{post.tempo}</div>
                </div>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 shrink-0" onClick={() => toast.info("Salvo!")}>
                  <Bookmark className="w-4 h-4" />
                </Button>
              </div>

              {/* Content */}
              <p className="text-sm leading-relaxed mb-4">{post.conteudo}</p>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-3 border-t border-border">
                <button
                  className={cn("flex items-center gap-1.5 text-sm transition-colors", isLiked ? "text-rose-500" : "text-muted-foreground hover:text-rose-500")}
                  onClick={() => toggleLike(post.id)}
                >
                  <Heart className={cn("w-4 h-4", isLiked && "fill-rose-500")} />
                  <span>{post.curtidas + (isLiked ? 1 : 0)}</span>
                </button>
                <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-indigo-600 transition-colors" onClick={() => toast.info("Comentários")}>
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.comentarios}</span>
                </button>
                <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-indigo-600 transition-colors ml-auto" onClick={() => toast.info("Compartilhado!")}>
                  <Share2 className="w-4 h-4" />
                  Compartilhar
                </button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
