"""Add google_id to users table for OAuth support

Revision ID: a1b2c3d4e5f6
Revises: d66767848efe
Create Date: 2026-02-12 23:45:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = 'd66767848efe'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add google_id column and make password_hash nullable"""
    # Add google_id column
    op.add_column('users', sa.Column('google_id', sa.String(), nullable=True))
    op.create_index(op.f('ix_users_google_id'), 'users', ['google_id'], unique=True)
    
    # Make password_hash nullable for OAuth users
    with op.batch_alter_table('users') as batch_op:
        batch_op.alter_column('password_hash',
                            existing_type=sa.String(),
                            nullable=True)


def downgrade() -> None:
    """Remove google_id column and make password_hash required again"""
    # Remove google_id
    op.drop_index(op.f('ix_users_google_id'), table_name='users')
    op.drop_column('users', 'google_id')
    
    # Make password_hash required again
    with op.batch_alter_table('users') as batch_op:
        batch_op.alter_column('password_hash',
                            existing_type=sa.String(),
                            nullable=False)
