import { Card } from './types';

export function initializeDeck(): Card[] {
  const suits = ['♠', '♥', '♦', '♣'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const deck: Card[] = [];

  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank, faceUp: true, isZonker: false, isParkingLot: false });
    }
  }

  // Add two Zonkers
  deck.push({ suit: '', rank: 'Z', faceUp: true, isZonker: true, isParkingLot: false });
  deck.push({ suit: '', rank: 'Z', faceUp: true, isZonker: true, isParkingLot: false });

  // Add two Parking Lots
  deck.push({ suit: '', rank: 'P', faceUp: true, isZonker: false, isParkingLot: true });
  deck.push({ suit: '', rank: 'P', faceUp: true, isZonker: false, isParkingLot: true });

  return deck;
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function haul(market: Card[], card1: Card, card2: Card): { success: boolean; newMarket: Card[]; hauledCards: Card[] } {
  const index1 = market.indexOf(card1);
  const index2 = market.indexOf(card2);

  if (Math.abs(index1 - index2) !== 1 || card1.rank !== card2.rank) {
    return { success: false, newMarket: market, hauledCards: [] };
  }

  const newMarket = market.filter(card => card !== card1 && card !== card2);
  return { success: true, newMarket, hauledCards: [card1, card2] };
}

export function performFleaHop(market: Card[], selectedCard: Card, newPosition: number): { success: boolean; newMarket: Card[] } {
  const oldPosition = market.indexOf(selectedCard);
  if (oldPosition === -1 || newPosition === -1 || oldPosition === newPosition) {
    return { success: false, newMarket: market };
  }

  const newMarket = [...market];
  newMarket.splice(oldPosition, 1);
  newMarket.splice(newPosition, 0, selectedCard);
  return { success: true, newMarket };
}

export function isValidDevilHop(market: Card[], selectedCards: Card[]): boolean {
  if (selectedCards.length !== 4) return false;
  const suits = new Set(selectedCards.map(card => card.suit));
  return suits.size === 4;
}

export function performDevilHop(market: Card[], selectedCards: Card[]): { success: boolean; newMarket: Card[] } {
  if (!isValidDevilHop(market, selectedCards)) {
    return { success: false, newMarket: market };
  }

  const newMarket = market.filter(card => !selectedCards.includes(card));
  newMarket.push(...selectedCards);
  return { success: true, newMarket };
}

export function isValidWalkyTalky(market: Card[], selectedCards: Card[]): boolean {
  if (selectedCards.length !== 3) return false;
  const [card1, card2, card3] = selectedCards;
  return (
    market.indexOf(card2) === market.indexOf(card1) + 1 &&
    market.indexOf(card3) === market.indexOf(card2) + 1 &&
    card1.rank !== card2.rank &&
    card2.rank !== card3.rank
  );
}

export function performWalkyTalky(market: Card[], selectedCards: Card[]): { success: boolean; newMarket: Card[] } {
  if (!isValidWalkyTalky(market, selectedCards)) {
    return { success: false, newMarket: market };
  }

  const newMarket = [...market];
  const middleCardIndex = newMarket.indexOf(selectedCards[1]);
  newMarket.splice(middleCardIndex, 1);
  newMarket.push(selectedCards[1]);
  return { success: true, newMarket };
}

export function isValidZonkOut(market: Card[], selectedCards: Card[]): boolean {
  if (selectedCards.length !== 2) return false;
  const [card1, card2] = selectedCards;
  const index1 = market.indexOf(card1);
  const index2 = market.indexOf(card2);
  return (
    Math.abs(index1 - index2) === 1 &&
    ((card1.isZonker && card2.isZonker) ||
      (card1.isZonker && card2.isParkingLot) ||
      (card1.isParkingLot && card2.isZonker))
  );
}

export function performZonkOut(market: Card[], selectedCards: Card[]): { success: boolean; newMarket: Card[]; zonkedCard: Card | null } {
  if (!isValidZonkOut(market, selectedCards)) {
    return { success: false, newMarket: market, zonkedCard: null };
  }

  const zonkedCard = selectedCards.find(card => card.isZonker) || null;
  const newMarket = market.filter(card => !selectedCards.includes(card));
  return { success: true, newMarket, zonkedCard };
}

export function isValidHangout(market: Card[], selectedCards: Card[]): boolean {
  if (selectedCards.length !== 3) return false;
  const [card1, card2, card3] = selectedCards;
  const index1 = market.indexOf(card1);
  const index2 = market.indexOf(card2);
  const index3 = market.indexOf(card3);
  return (
    Math.abs(index1 - index2) === 1 &&
    Math.abs(index2 - index3) === 1 &&
    card2.isParkingLot &&
    card1.rank === card3.rank
  );
}

export function performHangout(market: Card[], selectedCards: Card[]): { success: boolean; newMarket: Card[]; hangoutCards: Card[] } {
  if (!isValidHangout(market, selectedCards)) {
    return { success: false, newMarket: market, hangoutCards: [] };
  }

  const newMarket = market.filter(card => !selectedCards.includes(card));
  const hangoutCards = selectedCards.filter(card => !card.isParkingLot);
  return { success: true, newMarket, hangoutCards };
}

export function isValidBargain(market: Card[], card1: Card, card2: Card): boolean {
  const index1 = market.indexOf(card1);
  const index2 = market.indexOf(card2);
  return Math.abs(index1 - index2) === 1;
}

export function performBargain(market: Card[], card1: Card, card2: Card): { success: boolean; newMarket: Card[] } {
  if (!isValidBargain(market, card1, card2)) {
    return { success: false, newMarket: market };
  }

  const newMarket = [...market];
  const index1 = newMarket.indexOf(card1);
  const index2 = newMarket.indexOf(card2);
  [newMarket[index1], newMarket[index2]] = [newMarket[index2], newMarket[index1]];
  return { success: true, newMarket };
}

export function isValidEasyGo(market: Card[], selectedCards: Card[]): boolean {
  if (selectedCards.length !== 2) return false;
  const [card1, card2] = selectedCards;
  const index1 = market.indexOf(card1);
  const index2 = market.indexOf(card2);
  return Math.abs(index1 - index2) === 1 && card1.suit === card2.suit;
}

export function performEasyGo(market: Card[], selectedCards: Card[]): { success: boolean; newMarket: Card[]; easyGoCards: Card[] } {
  if (!isValidEasyGo(market, selectedCards)) {
    return { success: false, newMarket: market, easyGoCards: [] };
  }

  const newMarket = market.filter(card => !selectedCards.includes(card));
  return { success: true, newMarket, easyGoCards: selectedCards };
}