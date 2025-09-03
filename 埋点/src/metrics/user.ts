class UserTracker {
    private isNewUser: boolean;
    private userId: string;

    constructor() {
        this.userId = this.getUserId();
        this.isNewUser = this.checkIfNewUser();
    }

    private getUserId(): string {
        // 生成或获取用户ID的逻辑
        const existingUserId = this.getStoredUserId();
        if (existingUserId) {
            return existingUserId;
        }
        const newUserId = this.generateUserId();
        this.storeUserId(newUserId);
        return newUserId;
    }

    private getStoredUserId(): string | null {
        // 从存储中获取用户ID的逻辑
        return localStorage.getItem('userId');
    }

    private generateUserId(): string {
        // 生成唯一用户ID的逻辑
        return 'user-' + Date.now();
    }

    private storeUserId(userId: string): void {
        // 将用户ID存储到本地存储的逻辑
        localStorage.setItem('userId', userId);
    }

    private checkIfNewUser(): boolean {
        // 判断用户是否为新用户的逻辑
        return !this.getStoredUserId();
    }

    public trackUser(): { userId: string; isNewUser: boolean } {
        return {
            userId: this.userId,
            isNewUser: this.isNewUser,
        };
    }
}

export default UserTracker;