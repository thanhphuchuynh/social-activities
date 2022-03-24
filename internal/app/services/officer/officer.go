package officerServices

import (
	"context"
	"fmt"
	"time"

	"social-activities/internal/app/types"
	"social-activities/internal/pkg/config"
	"social-activities/internal/pkg/glog"
	"social-activities/internal/pkg/jwt"

	"github.com/pkg/errors"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Repository interface {
	Test(ctx context.Context) string
	FindByCode(ctx context.Context, code string) (*types.Officer, error)
	Insert(ctx context.Context, user types.Officer) error
}

// Service is an user service
type Service struct {
	conf   *config.Config
	em     *config.ErrorMessage
	repo   Repository
	logger glog.Logger
}

func NewService(c *config.Config, e *config.ErrorMessage, r Repository, l glog.Logger) *Service {
	return &Service{
		conf:   c,
		em:     e,
		repo:   r,
		logger: l,
	}
}

func (s *Service) TestS(ctx context.Context) string {
	return fmt.Sprintf("%s %s ", "S ", s.repo.Test(ctx))
}

func (s *Service) RegisterSrv(ctx context.Context, userLogin types.Officer) (*types.UserResponseSignUp, error) {

	if _, err := s.repo.FindByCode(ctx, userLogin.Code); err == nil {
		s.logger.Errorf("Email email exits", err)
		return nil, errors.Wrap(errors.New("Code exits"), "Email exits, can't insert user")
	}

	userLogin.Password, _ = jwt.HashPassword(userLogin.Password)
	officer := types.Officer{
		ID:       primitive.NewObjectID(),
		Name:     userLogin.Name,
		Email:    userLogin.Email,
		Password: userLogin.Password,
		Code:     userLogin.Code,
		Birthday: time.Now(),
		Avatar:   userLogin.Avatar,
		Gender:   userLogin.Avatar,
		Country:  userLogin.Country,
		Phone:    userLogin.Phone,
		Salary:   0.0,
		Role:     "none",
		CreateAt: time.Now(),
		UpdateAt: time.Now()}

	if err := s.repo.Insert(ctx, officer); err != nil {
		s.logger.Errorf("Can't insert user", err)
		return nil, errors.Wrap(err, "Can't insert user")
	}

	var tokenString string
	tokenString, err := jwt.GenToken(types.OfficerInToken{
		ID:    officer.ID,
		Name:  officer.Name,
		Email: officer.Email,
	}, s.conf.Jwt.Duration)

	if err != nil {
		s.logger.Errorf("Can't gen token after insert", err)
		return nil, errors.Wrap(err, "Can't insert user")
	}
	s.logger.Infof("Register completed", officer)

	return &types.UserResponseSignUp{
		ID:    officer.ID,
		Name:  officer.Name,
		Email: officer.Email,
		Code:  officer.Code,
		Token: tokenString}, nil

}